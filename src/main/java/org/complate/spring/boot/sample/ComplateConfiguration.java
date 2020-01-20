package org.complate.spring.boot.sample;

import com.github.complate.ComplateViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ComplateConfiguration {

    @Bean
    public ComplateViewResolver complateViewResolver() {
        return new ComplateViewResolver();
    }
}
