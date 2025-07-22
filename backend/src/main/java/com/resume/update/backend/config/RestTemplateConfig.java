package com.resumeupdater.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.config.RequestConfig;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        RequestConfig config = RequestConfig.custom()
            .setConnectTimeout(30000, java.util.concurrent.TimeUnit.MILLISECONDS) // 30 seconds
            .setResponseTimeout(60000, java.util.concurrent.TimeUnit.MILLISECONDS)  // 60 seconds
            .build();

        CloseableHttpClient client = HttpClients.custom()
            .setDefaultRequestConfig(config)
            .build();

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(client);

        RestTemplate restTemplate = new RestTemplate(factory);
        return restTemplate;
    }
}
