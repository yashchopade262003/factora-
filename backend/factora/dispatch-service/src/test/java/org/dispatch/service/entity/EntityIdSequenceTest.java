package org.dispatch.service.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.lang.reflect.Field;

import org.junit.jupiter.api.Test;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.SequenceGenerator;

/**
 * Guards the "IDs must come from a sequence starting at 101" requirement
 * for Dispatch. See buyer-service's EntityIdSequenceTest for the rationale.
 */
class EntityIdSequenceTest {

    @Test
    void dispatchIdStartsAt101() throws NoSuchFieldException {
        Field idField = Dispatch.class.getDeclaredField("dispatchId");

        GeneratedValue generatedValue = idField.getAnnotation(GeneratedValue.class);
        assertEquals(GenerationType.SEQUENCE, generatedValue.strategy());

        SequenceGenerator sequenceGenerator = idField.getAnnotation(SequenceGenerator.class);
        assertEquals(101, sequenceGenerator.initialValue());
        assertEquals(1, sequenceGenerator.allocationSize());
    }
}
