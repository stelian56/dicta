package net.geocentral.dicta.camel;

import net.geocentral.dicta.Dicta;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;

public class DictaIn implements Processor {

    private Dicta model;
    private String varName;
    private String type;
    
    public void setModelWrapper(DictaWrapper modelWrapper) {
        this.model = modelWrapper.getModel();
    }
    
    public void setVarName(String varName) {
        this.varName = varName;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public void process(Exchange exchange) throws Exception {
        Object value;
        String input = String.valueOf(exchange.getIn().getBody());
        switch (type) {
        case "number":
            value = Double.valueOf(input);
            break;
        default:
            value = input;
        }
        model.set(varName, value);
    }
}
