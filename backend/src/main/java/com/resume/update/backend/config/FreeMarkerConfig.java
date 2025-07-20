package com.resumeupdater.config;

import freemarker.template.Configuration;
import freemarker.template.TemplateExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@org.springframework.context.annotation.Configuration
public class FreeMarkerConfig {

    @Bean
    @Primary
    public Configuration freemarkerConfiguration() {
        Configuration cfg = new Configuration(Configuration.VERSION_2_3_32);
        
        // Set template loader to load from classpath
        cfg.setClassForTemplateLoading(this.getClass(), "/templates");
        
        // Set default encoding
        cfg.setDefaultEncoding("UTF-8");
        
        // Set template exception handler
        cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        
        // Don't log exceptions inside FreeMarker
        cfg.setLogTemplateExceptions(false);
        
        // Wrap unchecked exceptions thrown during template processing
        cfg.setWrapUncheckedExceptions(true);
        
        // Don't fall back to higher scopes when reading a null loop variable
        cfg.setFallbackOnNullLoopVariable(false);
        
        return cfg;
    }
}
