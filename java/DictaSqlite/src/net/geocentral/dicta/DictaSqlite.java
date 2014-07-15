package net.geocentral.dicta;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Date;
import java.util.Random;
import java.util.Scanner;

public class DictaSqlite {

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

    public static void main(String[] args) throws Exception {
        String text = new Scanner(new File("dicta/setget.dicta")).useDelimiter("\\A").next();
        DictaModel model = new DictaModel();
        model.parse(text);
        Random random = new Random();
        int queryCount = (int)1e4;
        Date start = new Date();
        for (int index = 0; index < queryCount; index++) {
            int idValue = random.nextInt(10) + 1;
            model.set("id", idValue);
            model.get("name");
        }
        long elapsed = new Date().getTime() - start.getTime();
        double rate = 1e3*queryCount/elapsed;
        System.out.println(String.format("%s queries/second", rate));
    }

//    public static void main(String[] args) throws Exception {
//        DictaSqlite dictaSqlite = new DictaSqlite();
//        String text = new Scanner(new File("dicta/sqlite.dicta")).useDelimiter("\\A").next();
//        DictaModel model = new DictaModel();
//        model.parse(text);
//        model.AddFunction("sqlite", dictaSqlite, "sqliteQuery");
//        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
//        while (true) {
//            String line = reader.readLine();
//            int id = Integer.valueOf(line);
//            model.set("id", id);
//            Object name = model.get("name");
//            System.out.println(name);
//        }
//    }
}
