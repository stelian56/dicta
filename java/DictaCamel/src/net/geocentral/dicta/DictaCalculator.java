package net.geocentral.dicta;

public class DictaCalculator {

    private Dicta model;
    
    public DictaCalculator() throws Exception {
        model = new Dicta();
        model.parse("/* @once */ a = 0; a += x;");
    }
    
    public int calculate(String input) throws Exception {
        model.set("x", Integer.valueOf(input));
        return ((Double)model.get("a")).intValue();
    }
}
