using EdgeJs;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Data.SQLite;

namespace DictaDotNet
{
    public class FunctionTest
    {
        private void TestSqlite()
        {
            Console.WriteLine("***\nTestSqlite");
            string text = File.ReadAllText(@"dicta\samples\sqlite.dicta");
            Dicta model = new Dicta();
            model.Parse(text);
            model.AddFunction("sqlite", sqliteQuery);
            int id = 5;
            model.Set("id", id);
            string name = model.Get("name");
            if (name != "five")
            {
                throw new Exception("Sqlite test FAILED");
            }
            Console.WriteLine("Sqlite test OK");
        }

        private static Func<object, object> sqliteQuery = ((dynamic id) =>
        {
            SQLiteConnection connection = new SQLiteConnection(@"Data Source=sqlite\test.sqlite;");
            connection.Open();
            SQLiteCommand command = connection.CreateCommand();
            command.CommandText = "SELECT name FROM numbers WHERE id=" + id;
            SQLiteDataReader reader = command.ExecuteReader();
            object name = "";
            while (reader.Read())
            {
                name = reader["name"];
                break;
            }
            connection.Close();
            return name;
        });

        public void All()
        {
            TestSqlite();
        }
    }
}