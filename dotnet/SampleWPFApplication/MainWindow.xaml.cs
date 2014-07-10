using System.Windows;
using Dicta;
using System;

namespace WpfApplication
{
    public partial class MainWindow : Window
    {
        private DictaWPF dicta;

        public MainWindow()
        {
            InitializeComponent();
            dicta = new DictaWPF();
            dicta.Init(this);
        }
    }
}
