using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dicta;
using System.IO;
using System.Data.SQLite;

namespace DictaSqlite
{
    public class DictaSqlite
    {
        private static DictaModel model;

        private static Func<object, object> sqliteQuery = ((dynamic id) =>
        {
            SQLiteConnection connection = new SQLiteConnection(@"Data Source=sqlite\dicta.sqlite;");
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

        public static void Main(string[] args)
        {
            string fileName = @"dicta\sqlite.dicta";
            string text = File.ReadAllText(fileName);
            model = new DictaModel();
            model.Parse(text);
            model.AddFunction("sqlite", sqliteQuery);
            while (true)
            {
                int id;
                Int32.TryParse(Console.ReadLine(), out id);
                if (id != null)
                {
                    model.Set("id", id);
                    var name = model.Get("name");
                    Console.WriteLine(name);
                }
            }
        }
    }
}
