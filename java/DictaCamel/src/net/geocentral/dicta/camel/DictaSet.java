package net.geocentral.dicta.camel;

import net.geocentral.dicta.Dicta;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;

public class DictaSet implements Processor {

    private Dicta model;
    private String varName;
    
    public void setModelWrapper(DictaWrapper modelWrapper) {
        this.model = modelWrapper.getModel();
    }
    
    public void setVarName(String varName) {
        this.varName = varName;
    }
    
    public void process(Exchange exchange) throws Exception {
        Object value = exchange.getIn().getBody();
        model.set(varName, value);
    }
}
