using EdgeJs;
using System;
using System.IO;
using System.Threading.Tasks;

namespace DictaDotNet
{
    public class TestUtils
    {

        public static void RunTest(string text)
        {
            Task.Run((Action)new TestHelper(text).TestRunner).Wait();
        }

        private static string WrapFunc(string text)
        {
            return string.Format("return function (data, callback) {{\n{0}\ncallback(null, data);}}", text);
        }

        class TestHelper
        {
            private string text;

            public TestHelper(string text)
            {
                this.text = text;
            }

            public void TestRunner()
            {
                string wrappedText = WrapFunc(text);
                try
                {
                    var func = Edge.Func(wrappedText);
                    var result = func(null).Result;
                    Console.WriteLine(result);
                }
                catch (Exception exception)
                {
                    Console.WriteLine(exception.InnerException.Message);
                }
            }
        }
    }
}