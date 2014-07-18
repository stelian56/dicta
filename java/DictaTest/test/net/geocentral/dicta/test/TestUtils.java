package net.geocentral.dicta.test;

import java.io.File;
import java.util.Scanner;

import net.geocentral.dicta.DictaModel;

public class TestUtils {

    public static DictaModel readModel(String modelName) throws Exception {
        String fileName = String.format("dicta/%s.dicta", modelName);
        String text = new Scanner(new File(fileName)).useDelimiter("\\A").next();
        DictaModel model = new DictaModel(); 
        model.init();
        model.parse(text);
        return model;
    }

}
