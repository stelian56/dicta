using System.Windows;

namespace DictaDotNet
{
    public static class DictaProperty
    {
        public static readonly DependencyProperty DictaModel = DependencyProperty.RegisterAttached("DictaModel",
            typeof(string), typeof(DictaProperty), new FrameworkPropertyMetadata(null));

        public static readonly DependencyProperty DictaGet = DependencyProperty.RegisterAttached("DictaGet",
            typeof(string), typeof(DictaProperty), new FrameworkPropertyMetadata(null));

        public static readonly DependencyProperty DictaSet = DependencyProperty.RegisterAttached("DictaSet",
            typeof(string), typeof(DictaProperty), new FrameworkPropertyMetadata(null));

        public static readonly DependencyProperty DictaCallback = DependencyProperty.RegisterAttached("DictaCallback",
            typeof(string), typeof(DictaProperty), new FrameworkPropertyMetadata(null));

        public static readonly DependencyProperty DictaWatch = DependencyProperty.RegisterAttached("DictaWatch",
            typeof(string), typeof(DictaProperty), new FrameworkPropertyMetadata(null));

        public static readonly DependencyProperty DictaType = DependencyProperty.RegisterAttached("DictaType",
            typeof(string), typeof(DictaProperty), new FrameworkPropertyMetadata(null));

        public static string GetDictaModel(UIElement element)
        {
            return (string)element.GetValue(DictaModel);
        }

        public static void SetDictaModel(UIElement element, string value)
        {
        }

        public static string GetDictaGet(UIElement element)
        {
            return (string)element.GetValue(DictaGet);
        }

        public static void SetDictaGet(UIElement element, string value)
        {
        }

        public static string GetDictaSet(UIElement element)
        {
            return (string)element.GetValue(DictaSet);
        }

        public static void SetDictaSet(UIElement element, string value)
        {
        }

        public static string GetDictaWatch(UIElement element)
        {
            return (string)element.GetValue(DictaWatch);
        }

        public static void SetDictaWatch(UIElement element, string value)
        {
        }

        public static string GetDictaCallback(UIElement element)
        {
            return (string)element.GetValue(DictaCallback);
        }

        public static void SetDictaCallback(UIElement element, string value)
        {
        }

        public static string GetDictaType(UIElement element)
        {
            return (string)element.GetValue(DictaType);
        }

        public static void SetDictaType(UIElement element, string value)
        {
        }
    }
}
