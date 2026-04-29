ALTER TABLE `bookings` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `owner_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `walker_id` bigint unsigned NOT NULL;