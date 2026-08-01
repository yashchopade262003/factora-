package com.factoryflow.auth.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.lang.reflect.Field;

import org.junit.jupiter.api.Test;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.SequenceGenerator;

/**
 * Guards the "IDs must come from a sequence starting at 101" requirement
 * for Role, User, and Vendor. See buyer-service's EntityIdSequenceTest for
 * the rationale.
 */
class EntityIdSequenceTest {

    private void assertUsesSequenceStartingAt101(Class<?> entityClass, String idFieldName) throws NoSuchFieldException {
        Field idField = entityClass.getDeclaredField(idFieldName);

        GeneratedValue generatedValue = idField.getAnnotation(GeneratedValue.class);
        assertEquals(GenerationType.SEQUENCE, generatedValue.strategy(),
                entityClass.getSimpleName() + "." + idFieldName + " must use GenerationType.SEQUENCE");

        SequenceGenerator sequenceGenerator = idField.getAnnotation(SequenceGenerator.class);
        assertEquals(101, sequenceGenerator.initialValue(),
                entityClass.getSimpleName() + "." + idFieldName + " sequence must start at 101");
        assertEquals(1, sequenceGenerator.allocationSize());
    }

    @Test
    void roleIdStartsAt101() throws NoSuchFieldException {
        assertUsesSequenceStartingAt101(Role.class, "roleId");
    }

    @Test
    void userIdStartsAt101() throws NoSuchFieldException {
        assertUsesSequenceStartingAt101(User.class, "userId");
    }

    @Test
    void vendorIdStartsAt101() throws NoSuchFieldException {
        assertUsesSequenceStartingAt101(Vendor.class, "vendorId");
    }
}
