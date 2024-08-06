package com.shpynta.common.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.experimental.UtilityClass;

@UtilityClass
public class JsonUtils {

    private final ObjectMapper MAPPER = new ObjectMapper().enable(JsonGenerator.Feature.IGNORE_UNKNOWN);

    @SneakyThrows
    public <T> T deserialize(String json, Class<T> clazz) {
        return MAPPER.readValue(json, clazz);
    }

    @SneakyThrows
    public String serialize(Object object) {
        return MAPPER.writeValueAsString(object);
    }
}
