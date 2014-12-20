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
        private List<BindSource> inSources = new List<BindSource>();
        private List<BindSource> outSources = new List<BindSource>();

        public void Init(System.Windows.UIElement uiElement)
        {
            ParseModel(uiElement);
            ParseUIElements(uiElement);
        }

        private void ParseModel(UIElement uiElement)
        {
            string fileName = DictaProperty.GetModel(uiElement);
            string text = File.ReadAllText(fileName);
            model = new Dicta();
            model.SetStatusListener(this);
            model.Parse(text);
        }

        private void ParseUIElements(object element)
        {
            UIElement uiElement = element as UIElement;
            if (uiElement != null)
            {
                string varName = DictaProperty.GetIn(uiElement);
                if (varName != null)
                {
                    Control control = uiElement as Control;
                    Binding binding = new Binding("Action");
                    binding.Mode = BindingMode.OneWayToSource;
                    BindSource source = new BindSource(control, model);
                    binding.Source = source;
                    inSources.Add(source);
                    if (control is TextBox)
                    {
                        control.SetBinding(TextBox.TextProperty, binding);
                    }
                    else if (control is ComboBox)
                    {
                        control.SetBinding(ComboBox.SelectedValueProperty, binding);
                    }
                }
                varName = DictaProperty.GetOut(uiElement);
                if (varName != null)
                {
                    TextBlock textBlock = uiElement as TextBlock;
                    if (textBlock != null)
                    {
                        BindSource source = new BindSource(textBlock, model);
                        outSources.Add(source);
                        textBlock.DataContext = source;
                        Binding binding = new Binding("Action");
                        binding.Mode = BindingMode.OneWay;
                        textBlock.SetBinding(TextBlock.TextProperty, binding);
                        model.Watch(varName);
                        string callback = DictaProperty.GetCallback(uiElement);
                        if (callback != null)
                        {
                            model.AddFunction(callback, delegate(object value)
                            {
                                model.Set(varName, value);
                                return true;
                            }, true);
                        }
                    }
                    DataGrid dataGrid = uiElement as DataGrid;
                    if (dataGrid != null)
                    {
                        BindSource source = new BindSource(dataGrid, model);
                        outSources.Add(source);
                        dataGrid.DataContext = source;
                        Binding binding = new Binding("Action");
                        binding.Mode = BindingMode.OneWay;
                        dataGrid.SetBinding(DataGrid.ItemsSourceProperty, binding);
                        model.Watch(varName);
                        //DataTable dataTable = new DataTable("myTable");
                        //dataTable.Columns.Add("2%");
                        //dataTable.Columns.Add("3%");
                        //dataTable.Columns.Add("4%");
                        //dataTable.Columns.Add("5%");
                        //dataTable.Rows.Add(11, 12, 13, 14);
                        //dataTable.Rows.Add(21, 22, 23, 24);
                        //DataSet dataset = new DataSet("myDataset");
                        //dataset.Tables.Add(dataTable);
                        //dataGrid.ItemsSource = dataTable.DefaultView;
                    }
                }
            }
            if (element is DependencyObject)
            {
                foreach (object child in LogicalTreeHelper.GetChildren((DependencyObject)element))
                {
                    ParseUIElements(child);
                }
            }
        }

        public void StatusChanged(string[] staleVarNames)
        {
            foreach (string varName in staleVarNames)
            {
                foreach(BindSource source in outSources)
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
            varName = DictaProperty.GetIn(uiElement);
            if (varName != null)
            {
                type = DictaProperty.GetType(uiElement);
            }
            else
            {
                varName = DictaProperty.GetOut(uiElement);
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
                object varValue = model.Get(varName);
                if (uiElement is TextBlock)
                {
                    return varValue; // TODO ToString() ?
                }
                if (uiElement is DataGrid)
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
                TextBlock control = value as TextBlock;
                if (control != null)
                {
                    text = control.Text;
                }
                else
                {
                    text = (value as String).Trim();
                }
                if (text.Length > 0)
                {
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
                        string trigger = DictaProperty.GetTrigger(uiElement);
                        if (trigger != null)
                        {
                            model.Get(trigger);
                        }
                    }
                }
            }
        }
    }
}
