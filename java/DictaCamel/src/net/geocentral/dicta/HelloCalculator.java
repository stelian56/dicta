package net.geocentral.dicta;

import java.util.HashMap;
import java.util.Map;

public class HelloCalculator {

    private Map<String, Integer> vars = new HashMap<String, Integer>();
    
    public String getVar(String varName) {
        int result = 0;
        for (int value : vars.values()) {
            result += value;
        }
        return varName + "=" + result;
    }

    public void setVar(String varName, String value) {
        vars.put(varName, Integer.valueOf(value.trim()));
    }
}
