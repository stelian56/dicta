using EdgeJs;
using System;
using System.Collections.Generic;
using System.ComponentModel;
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
//                    binding.UpdateSourceTrigger = UpdateSourceTrigger.PropertyChanged;
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
                    TextBlock control = uiElement as TextBlock;
                    BindSource source = new BindSource(control, model);
                    outSources.Add(source);
                    control.DataContext = source;
                    Binding binding = new Binding("Action");
                    binding.Mode = BindingMode.OneWay;
                    control.SetBinding(TextBlock.TextProperty, binding);
                    model.Watch(varName);
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
                string varValue = model.Get(varName);
                return varValue;
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
                    }
                }
            }
        }
    }
}
