package net.geocentral.dicta.sample;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;


public class AutoIncrementSample {

    static ApplicationContext context;
    
    public static void main(String[] args) throws Exception {
        context = new ClassPathXmlApplicationContext("context/camelContext.xml");
        Thread.sleep(60*60*1000);
    }
}
