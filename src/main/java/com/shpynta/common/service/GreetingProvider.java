package com.shpynta.common.service;

import org.springframework.stereotype.Component;

import static java.lang.String.format;

@Component
public class GreetingProvider {

    public String getGreeting(String name) {
        return format("Hello, dear %s!", name);
    }
}
