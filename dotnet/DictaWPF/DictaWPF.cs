using EdgeJs;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Common;
using System.Dynamic;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

namespace DictaDotNet
{
    public class DictaWPF : IDictaStatusListener
    {
        private Dicta model;
        private List<BindSource> watchSources = new List<BindSource>();
        enum AttributeType
        {
            Get,
            Set
        };
        public void Init(System.Windows.UIElement uiElement)
        {
            ParseModel(uiElement);
            ParseUIElements(uiElement);
        }

        private void ParseModel(UIElement uiElement)
        {
            string fileName = DictaProperty.GetDictaModel(uiElement);
            string text = File.ReadAllText(fileName);
            model = new Dicta();
            model.SetStatusListener(this);
            model.Parse(text);
        }

        private void ParseUIElements(object element)
        {
            ParseUIElements(element, AttributeType.Get);
            ParseUIElements(element, AttributeType.Set);
        }

        private void ParseUIElements(object element, AttributeType attributeType)
        {
            UIElement uiElement = element as UIElement;
            TextBox textBox = element as TextBox;
            ComboBox comboBox = element as ComboBox;
            TextBlock textBlock = element as TextBlock;
            DataGrid dataGrid = element as DataGrid;
            if (textBox != null || comboBox != null || dataGrid != null || textBlock != null)
            {
                Binding binding = new Binding("Action");
                BindSource source = new BindSource(uiElement, model);
                switch (attributeType)
                {
                    case AttributeType.Get:
                        binding.Mode = BindingMode.OneWay;
                        string setVarName = DictaProperty.GetDictaSet(uiElement);
                        if (setVarName == null)
                        {
                            string getVarName = DictaProperty.GetDictaGet(uiElement);
                            string watchVarName = DictaProperty.GetDictaWatch(uiElement);
                            if (getVarName != null || watchVarName != null)
                            {
                                if (textBlock != null)
                                {
                                    if (watchVarName != null)
                                    {
                                        watchSources.Add(source);
                                    }
                                    textBlock.DataContext = source;
                                    textBlock.SetBinding(TextBlock.TextProperty, binding);
                                }
                                if (dataGrid != null)
                                {
                                    if (watchVarName != null)
                                    {
                                        watchSources.Add(source);
                                    }
                                    dataGrid.DataContext = source;
                                    dataGrid.SetBinding(DataGrid.ItemsSourceProperty, binding);
                                }
                            }
                            if (watchVarName != null)
                            {
                                model.Watch(watchVarName);
                                string callback = DictaProperty.GetDictaCallback(uiElement);
                                if (callback != null)
                                {
                                    model.AddFunction(callback, delegate(object value)
                                    {
                                        model.Set(watchVarName, value);
                                        return true;
                                    }, true);
                                }
                            }
                        }
                        break;
                    case AttributeType.Set:
                        binding.Mode = BindingMode.OneWayToSource;
                        binding.Source = source;
                        if (textBox != null)
                        {
                            textBox.SetBinding(TextBox.TextProperty, binding);
                        }
                        else if (comboBox != null)
                        {
                            comboBox.SetBinding(ComboBox.SelectedValueProperty, binding);
                        }
                        break;
                }
            }
            if (element is DependencyObject)
            {
                foreach (object child in LogicalTreeHelper.GetChildren((DependencyObject)element))
                {
                    ParseUIElements(child, attributeType);
                }
            }
        }

        public void StatusChanged(string[] staleVarNames)
        {
            foreach (string varName in staleVarNames)
            {
                foreach(BindSource source in watchSources)
                {
                    if (string.Equals(source.VarName, varName))
                    {
                        source.OnPropertyChanged("Action");
                    }
                }
            }
        }
    }

    class BindSource : INotifyPropertyChanged
    {
        private UIElement uiElement;
        private Dicta model;
        private string varName;
        private string type;
        public event PropertyChangedEventHandler PropertyChanged;

        public void OnPropertyChanged(string name)
        {
            PropertyChanged(this, new PropertyChangedEventArgs(name));
        }

        public BindSource(UIElement uiElement, Dicta model)
        {
            this.uiElement = uiElement;
            this.model = model;
            string setVarName = DictaProperty.GetDictaSet(uiElement);
            if (setVarName != null)
            {
                type = DictaProperty.GetDictaType(uiElement);
                varName = setVarName;
            }
            else
            {
                string getVarName = DictaProperty.GetDictaGet(uiElement);
                if (getVarName != null)
                {
                    varName = getVarName;
                }
                else
                {
                    string watchVarName = DictaProperty.GetDictaWatch(uiElement);
                    if (watchVarName != null)
                    {
                        varName = watchVarName;
                    }
                }
            }
        }

        public string VarName
        {
            get { return varName; }
            set { throw new NotImplementedException(); }
        }

        public object Action
        {
            get {
                TextBlock textBlock = uiElement as TextBlock;
                DataGrid dataGrid = uiElement as DataGrid;
                object varValue = model.Get(varName);
                if (textBlock != null)
                {
                    return varValue;
                }
                if (dataGrid != null)
                {
                    dynamic expObj = varValue as ExpandoObject;
                    if (expObj != null)
                    {
                        List<object[]> values = new List<object[]>();
                        DataTable dataTable = new DataTable();
                        foreach (KeyValuePair<string, object> keyValue in expObj)
                        {
                            
                            dataTable.Columns.Add(keyValue.Key);
                            values.Add(keyValue.Value as object[]);
                        }
                        int columnCount = dataTable.Columns.Count;
                        int rowCount = values[0].Length;
                        for (int rowIndex = 0; rowIndex < rowCount; rowIndex++)
                        {
                            object[] row = new object[columnCount];
                            for (int columnIndex = 0; columnIndex < columnCount; columnIndex++)
                            {
                                row[columnIndex] = values[columnIndex][rowIndex];
                            }
                            dataTable.Rows.Add(row);
                        }
                        DataView dataView = dataTable.DefaultView;
                        dataView.AllowEdit = false;
                        return dataView;
                    }
                }
                return null;
            }
            set
            {
                string text;
                TextBlock textBlock = value as TextBlock;
                if (textBlock != null)
                {
                    text = textBlock.Text;
                }
                else
                {
                    if (value == null)
                    {
                        text = null;
                    }
                    else
                    {
                        text = (value as String).Trim();
                    }
                }
                object varValue = null;
                switch (type)
                {
                    case "number":
                        int intValue;
                        if (Int32.TryParse(text, out intValue))
                        {
                            varValue = intValue;
                        }
                        break;
                    default:
                        varValue = text;
                        break;
                }
                if (varValue != null)
                {
                    model.Set(varName, varValue);
                    string getVarName = DictaProperty.GetDictaGet(uiElement);
                    if (getVarName != null)
                    {
                        model.Get(getVarName);
                    }
                }
            }
        }
    }
}
