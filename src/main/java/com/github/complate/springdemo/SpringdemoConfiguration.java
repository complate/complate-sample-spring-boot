package com.github.complate.springdemo;

import com.github.complate.ComplateViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringdemoConfiguration {
    @Bean
    public ComplateViewResolver complateViewResolver() {
        return new ComplateViewResolver();
    }
}
