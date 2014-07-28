package net.geocentral.dicta;

import org.apache.camel.ProducerTemplate;

public class SetGetCalculator {

    public void variableSet() {
        statusChanged();
    }

    private void statusChanged() {
        ProducerTemplate template = CamelTest.context.getBean("camelTemplate", ProducerTemplate.class);
        template.sendBody("direct:start", "Status changed");
    }
}
