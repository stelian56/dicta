package net.geocentral.dicta.test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import net.geocentral.dicta.Dicta;

import org.junit.Assert;
import org.junit.Test;

public class FunctionTest {

    @Test
    public void testSqlite() throws Exception {
        System.out.println("\n***\ntestSqlite");
        Dicta model = TestUtils.read("samples/sqlite");
        SqliteHelper sqliteHelper = new SqliteHelper();
        model.addFunction("sqlite", sqliteHelper, "sqliteQuery");
        int id = 5;
        model.set("id", id);
        Object name = model.get("name");
        Assert.assertEquals(name, "five");
        System.out.println("Sqlite test OK");
    }

    public class SqliteHelper {
    
        public String sqliteQuery(int id) throws Exception {
            Class.forName("org.sqlite.JDBC");
            Connection connection = DriverManager.getConnection("jdbc:sqlite:sqlite/dicta.sqlite");
            Statement statement = connection.createStatement();
            ResultSet rs = statement.executeQuery("SELECT name FROM numbers WHERE id=" + id);
            String name = "";
            while (rs.next()) {
                name = rs.getString("name");
                break;
            }
            connection.close();
            return name;
        }
    }
}
