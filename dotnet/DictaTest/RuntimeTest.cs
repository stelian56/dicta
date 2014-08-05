using EdgeJs;
using System;
using System.IO;
using System.Threading.Tasks;

namespace DictaDotNet
{
    public class RuntimeTest
    {
        private void TestSetGet()
        {
            Console.WriteLine("***\nTestSetGet");
            string text = File.ReadAllText(@".\edge\js\test\sundry\setGet.js");
            TestUtils.RunTest(text);
        }

        private void TestSortArray()
        {
            Console.WriteLine("***\nTestSortArray");
            string text = File.ReadAllText(@".\edge\js\test\sundry\sortArray.js");
            TestUtils.RunTest(text);
        }

        public void All()
        {
            TestSetGet();
            TestSortArray();
        }
    }
}