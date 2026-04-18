-- ============================================
-- SCRIPT DE MIGRACIONES PARA WALKERS
-- Ejecutar en MySQL Workbench o terminal
-- ============================================

USE `dog-walkers`;

-- ============================================
-- MIGRACIÓN 1: Agregar campo 'age'
-- ============================================
ALTER TABLE walkers 
ADD COLUMN IF NOT EXISTS age VARCHAR(10) 
COMMENT 'Edad del paseador';

-- Actualizar walkers existentes con un valor por defecto
UPDATE walkers 
SET age = '27' 
WHERE age IS NULL;

-- ============================================
-- MIGRACIÓN 2: Agregar campo 'coverImage'
-- ============================================
ALTER TABLE walkers 
ADD COLUMN IF NOT EXISTS coverImage VARCHAR(500) 
COMMENT 'Imagen de portada/presentación del paseador';

-- ============================================
-- VERIFICAR CAMBIOS
-- ============================================
DESCRIBE walkers;

-- Verificar que las columnas se agregaron correctamente
SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT, COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'walkers' 
AND COLUMN_NAME IN ('age', 'coverImage');

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- La tabla walkers debe tener ahora:
-- - age: VARCHAR(10)
-- - coverImage: VARCHAR(500)
-- ============================================
