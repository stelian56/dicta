package net.geocentral.dicta.test;

import java.io.File;
import java.util.Scanner;

import net.geocentral.dicta.Dicta;

public class TestUtils {

    public static Dicta read(String modelName) throws Exception {
        String fileName = String.format("../dicta/%s.dicta", modelName);
        Scanner scanner = new Scanner(new File(fileName));
        String text = scanner.useDelimiter("\\A").next();
        scanner.close();
        Dicta model = new Dicta(); 
        model.parse(text);
        return model;
    }

}
