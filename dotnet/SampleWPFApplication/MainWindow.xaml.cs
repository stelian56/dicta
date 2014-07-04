using System.Windows;
using Dicta;

namespace WpfApplication
{
    public partial class MainWindow : Window
    {
        private DictaWPFHelper dictaHelper;

        public MainWindow()
        {
            InitializeComponent();
            dictaHelper = new DictaWPFHelper();
            dictaHelper.Init(this);
        }
    }
}
