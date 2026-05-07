-- ============================================
-- MIGRACIÓN 0010: Agregar campos de ubicación
-- Ejecutar en MySQL Workbench o tu cliente MySQL
-- ============================================

USE `dog-walkers`;

-- Agregar columnas a la tabla OWNERS
ALTER TABLE `owners` ADD `address` varchar(255);
ALTER TABLE `owners` ADD `province` varchar(100);
ALTER TABLE `owners` ADD `city` varchar(255);
ALTER TABLE `owners` ADD `latitude` decimal(10,8);
ALTER TABLE `owners` ADD `longitude` decimal(11,8);

-- Agregar columnas a la tabla WALKERS
ALTER TABLE `walkers` ADD `address` varchar(255);
ALTER TABLE `walkers` ADD `province` varchar(100);
ALTER TABLE `walkers` ADD `city` varchar(255);
ALTER TABLE `walkers` ADD `latitude` decimal(10,8);
ALTER TABLE `walkers` ADD `longitude` decimal(11,8);

-- Verificar que las columnas se agregaron correctamente
DESCRIBE owners;
DESCRIBE walkers;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Ambas tablas (owners y walkers) deben tener ahora:
-- - address: varchar(255)
-- - province: varchar(100)
-- - city: varchar(255)
-- - latitude: decimal(10,8)
-- - longitude: decimal(11,8)
-- ============================================
