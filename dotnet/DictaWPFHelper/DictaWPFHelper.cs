using EdgeJs;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

namespace Dicta
{
    public class DictaWPFHelper : IDictaStatusListener
    {
        private DictaModel model;
        private List<BindSource> inSources = new List<BindSource>();
        private List<BindSource> outSources = new List<BindSource>();

        public void Init(System.Windows.UIElement uiElement)
        {
            ParseModel(uiElement);
            ParseUIElements(uiElement);
            //Task.Run((Action)Test).Wait();
        }

        private void ParseModel(UIElement uiElement)
        {
            string fileName = DictaProperty.GetModel(uiElement);
            string text = File.ReadAllText(fileName);
            model = new DictaModel();
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
                    TextBox control = uiElement as TextBox;
                    BindSource source = new BindSource(control, model);
                    inSources.Add(source);
                    control.DataContext = source;
                    Binding binding = new Binding("Action");
                    binding.Mode = BindingMode.OneWayToSource;
                    control.SetBinding(TextBox.TextProperty, binding);
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

        private async void Test()
        {
            string text = File.ReadAllText(@".\edge\js\test.js.func");
            try
            {
                var func = Edge.Func(text);
                var result = await func(null);
                Console.WriteLine(result);
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.InnerException.Message);
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
        private DictaModel model;
        private string varName;
        private string type;
        public event PropertyChangedEventHandler PropertyChanged;

        public void OnPropertyChanged(string name)
        {
            PropertyChanged(this, new PropertyChangedEventArgs(name));
        }

        public BindSource(UIElement uiElement, DictaModel model)
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

        public string Action
        {
            get {
                string varValue = model.Get(varName);
                return varValue;
            }
            set
            {
                if (value != null)
                {
                    TextBox control = uiElement as TextBox;
                    string text = (value as String).Trim();
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
                                varValue = string.Format("\"{0}\"", text);
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
}
