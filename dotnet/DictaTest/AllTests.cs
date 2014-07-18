using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DictaTest
{
    public class AllTests
    {
        public static void Main(string[] args)
        {
            new CoreTest().All();
            new PerformanceTest().All();
            new RuntimeTest().All();
            new FunctionTest().All();
            Console.ReadKey();
        }
    }
}
