package net.geocentral.dicta;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class CamelTest {

    static ApplicationContext context;
    
    public static void main(String[] args) throws Exception {
        context = new ClassPathXmlApplicationContext("camel-context/camel-context-dicta.xml");
        Thread.sleep(60*60*1000);
    }
}
     