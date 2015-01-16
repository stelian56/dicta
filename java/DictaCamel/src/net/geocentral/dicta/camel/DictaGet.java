package net.geocentral.dicta.camel;

import net.geocentral.dicta.Dicta;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.impl.DefaultMessage;

public class DictaGet {

    private Dicta model;
    private String varName;
    
    public void setModelWrapper(DictaWrapper modelWrapper) {
        this.model = modelWrapper.getModel();
    }
    
    public void setVarName(String varName) {
        this.varName = varName;
    }

    public void process(Exchange exchange) throws Exception {
        Message message = new DefaultMessage();
        Object value = model.get(varName);
        message.setBody(value);
        exchange.setIn(message);
    }
}
