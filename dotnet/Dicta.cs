using System;
using System.IO;
using System.Threading.Tasks;
using EdgeJs;
using System.Diagnostics;

namespace Dicta
{
    public class Dicta
    {
        public static async void MyFunc()
        {
            var text = File.ReadAllText(@".\edge\js\test.js");
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
            Task.Run((Action)MyFunc).Wait();
        }
    }
}
