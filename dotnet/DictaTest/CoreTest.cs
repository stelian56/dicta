using EdgeJs;
using System;
using System.IO;
using System.Threading.Tasks;

namespace DictaTest
{
    public class CoreTest
    {
        private void TestCore()
        {
            Console.WriteLine("\n***\nTestCore");
            string text = File.ReadAllText(@".\edge\js\test\dotnet\testCoreDotNet.js");
            TestUtils.RunTest(text);
        }

        public void All()
        {
            TestCore();
        }
    }
}