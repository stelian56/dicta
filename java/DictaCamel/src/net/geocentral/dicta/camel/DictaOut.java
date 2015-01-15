package net.geocentral.dicta.camel;

import java.util.Map;

import net.geocentral.dicta.Dicta;
import net.geocentral.dicta.DictaStatusListener;

import org.apache.camel.Consumer;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.Producer;
import org.apache.camel.impl.DefaultEndpoint;
import org.apache.camel.impl.DefaultMessage;

public class DictaOut extends DefaultEndpoint implements DictaStatusListener {

    private Dicta model;
    private String varName;
    private Processor processor;
    
    public void setModelWrapper(DictaWrapper modelWrapper) {
        this.model = modelWrapper.getModel();
        modelWrapper.addStatusListener(this);
    }
    
    public void setVarName(String varName) {
        this.varName = varName;
    }

    public void statusChanged(Map<String, Boolean> staleVarNames) throws Exception {
        for (String varName : staleVarNames.keySet()) {
            if (this.varName.equals(varName)) {
                Message message = new DefaultMessage();
                Object value = model.get(varName);
                message.setBody(value);
                Exchange exchange = this.createExchange();
                exchange.setIn(message);
                processor.process(exchange);
            }
        }
    }

    public Consumer createConsumer(Processor processor) throws Exception {
        this.processor = processor;
        return null;
    }

    public Producer createProducer() throws Exception {
        return null;
    }

    public boolean isSingleton() {
        return false;
    }
}
