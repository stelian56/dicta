using EdgeJs;
using System;
using System.IO;
using System.Threading.Tasks;

namespace DictaDotNet
{
    public class CoreTest
    {
        private void TestCore()
        {
            Console.WriteLine("\n***\nTestCore");
            string text = File.ReadAllText(@".\edge\js\test\dotnet\testCoreDotNet.js");
            Directory.SetCurrentDirectory("edge");
            TestUtils.RunTest(text);
            Directory.SetCurrentDirectory("..");
        }

        public void All()
        {
            TestCore();
        }
    }
}