using EdgeJs;
using System;
using System.IO;
using System.Threading.Tasks;
using Dicta;

namespace DictaTest
{
    public class PerformanceTest
    {
        private void TestConcat()
        {
            Console.WriteLine("***\nTestConcat");
            string text = File.ReadAllText(@"dicta\concat.dicta");
            DictaModel model = new DictaModel();
            model.Parse(text);
            int queryCount = (int)1e4;
            model.Set("count", queryCount);
            Console.WriteLine(string.Format("{0} concatenations", queryCount));
            for (int queryIndex = 1; queryIndex <= 10; queryIndex++) {
                DateTime start = DateTime.Now;
                model.Set("base", queryIndex);
                model.Get("a");
                TimeSpan elapsed = DateTime.Now - start;
                Console.WriteLine(string.Format("Run {0}: {1} milliseconds", queryIndex,
                    elapsed.TotalMilliseconds));
            }
            Console.WriteLine();
        }

        public void All()
        {
            TestConcat();
        }
    }
}