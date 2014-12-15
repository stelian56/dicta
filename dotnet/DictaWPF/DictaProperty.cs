using System.Windows;

namespace DictaDotNet
{
    public static class DictaProperty
    {
        public static readonly DependencyProperty Model = DependencyProperty.RegisterAttached("Model",
            typeof(string), typeof(DictaProperty), new FrameworkPropertyMetadata(null));

        public static readonly DependencyProperty In = DependencyProperty.RegisterAttached("In",
            typeof(string), typeof(DictaProperty), new FrameworkPropertyMetadata(null));

        public static readonly DependencyProperty Trigger = DependencyProperty.RegisterAttached("Trigger",
            typeof(string), typeof(DictaProperty), new FrameworkPropertyMetadata(null));

        public static readonly DependencyProperty Out = DependencyProperty.RegisterAttached("Out",
            typeof(string), typeof(DictaProperty), new FrameworkPropertyMetadata(null));

        public static readonly DependencyProperty Callback = DependencyProperty.RegisterAttached("Callback",
            typeof(string), typeof(DictaProperty), new FrameworkPropertyMetadata(null));

        public static readonly DependencyProperty Type = DependencyProperty.RegisterAttached("Type",
            typeof(string), typeof(DictaProperty), new FrameworkPropertyMetadata(null));

        public static string GetModel(UIElement element)
        {
            return (string)element.GetValue(Model);
        }

        public static void SetModel(UIElement element, string value)
        {
        }

        public static string GetIn(UIElement element)
        {
            return (string)element.GetValue(In);
        }

        public static void SetIn(UIElement element, string value)
        {
        }

        public static string GetTrigger(UIElement element)
        {
            return (string)element.GetValue(Trigger);
        }

        public static void SetTrigger(UIElement element, string value)
        {
        }

        public static string GetOut(UIElement element)
        {
            return (string)element.GetValue(Out);
        }

        public static void SetOut(UIElement element, string value)
        {
        }

        public static string GetCallback(UIElement element)
        {
            return (string)element.GetValue(Callback);
        }

        public static void SetCallback(UIElement element, string value)
        {
        }

        public static string GetType(UIElement element)
        {
            return (string)element.GetValue(Type);
        }

        public static void SetType(UIElement element, string value)
        {
        }
    }
}
