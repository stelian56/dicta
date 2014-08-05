package net.geocentral.dicta.test;

import java.io.File;
import java.util.Scanner;

import net.geocentral.dicta.Dicta;

public class TestUtils {

    public static Dicta read(String modelName) throws Exception {
        String fileName = String.format("dicta/%s.dicta", modelName);
        String text = new Scanner(new File(fileName)).useDelimiter("\\A").next();
        Dicta model = new Dicta(); 
        model.init();
        model.parse(text);
        return model;
    }

}
