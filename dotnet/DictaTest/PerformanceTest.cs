using EdgeJs;
using System;
using System.IO;
using System.Threading.Tasks;

namespace DictaDotNet
{
    public class PerformanceTest
    {
        private void TestConcat()
        {
            Console.WriteLine("***\nTestConcat");
            string text = File.ReadAllText(@"dicta\coretest\performance\concat.dicta");
            Dicta model = new Dicta();
            model.Parse(text);
            int appendCount = (int)1e4;
            model.Set("count", appendCount);
            int runCount = 10;
            DateTime start = DateTime.Now;
            for (int runIndex = 1; runIndex <= runCount; runIndex++)
            {
                model.Set("base", runIndex);
                model.Get("a");
            }
            TimeSpan elapsed = DateTime.Now - start;
            Console.WriteLine(string.Format("Appended {0} times in {1} milliseconds", appendCount,
                elapsed.TotalMilliseconds));
            Console.WriteLine();
        }

        public void All()
        {
            TestConcat();
        }
    }
}