using System.Windows;
using DictaDotNet;
using System;

namespace DictaSamples
{
    public partial class MainWindow : Window
    {
        private DictaWPF dictaWpf;

        public MainWindow()
        {
            InitializeComponent();
            dictaWpf = new DictaWPF();
            dictaWpf.Init(this);
        }
    }
}
