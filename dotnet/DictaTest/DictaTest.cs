using EdgeJs;
using System;
using System.IO;
using System.Threading.Tasks;

namespace DictaTest
{
    public class DictaTest
    {

        private static async void Test()
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

        public static void Main(string[] args)
        {
            Task.Run((Action)Test).Wait();
            Console.ReadKey();
        }
    }
}
