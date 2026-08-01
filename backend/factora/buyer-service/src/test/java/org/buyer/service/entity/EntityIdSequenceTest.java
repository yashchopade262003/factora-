package org.buyer.service.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.lang.reflect.Field;

import org.junit.jupiter.api.Test;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.SequenceGenerator;

/**
 * Guards the "IDs must come from a sequence starting at 101" requirement.
 * If someone reverts an entity back to GenerationType.IDENTITY (plain
 * auto-increment, which starts at 1) this test fails immediately instead
 * of only being noticed after data has already been created with the
 * wrong starting id.
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
        assertEquals(1, sequenceGenerator.allocationSize(),
                entityClass.getSimpleName() + "." + idFieldName
                        + " allocationSize must be 1 so ids are contiguous (101, 102, 103...) rather than "
                        + "jumping in blocks of the JPA default (50)");
    }

    @Test
    void buyerIdStartsAt101() throws NoSuchFieldException {
        assertUsesSequenceStartingAt101(Buyer.class, "buyerId");
    }

    @Test
    void buyerOrderIdStartsAt101() throws NoSuchFieldException {
        assertUsesSequenceStartingAt101(BuyerOrder.class, "orderId");
    }
}
