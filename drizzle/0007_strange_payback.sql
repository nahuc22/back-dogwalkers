CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`owner_id` int NOT NULL,
	`walker_id` int NOT NULL,
	`pet_ids` json NOT NULL,
	`date` varchar(10) NOT NULL,
	`start_time` varchar(5) NOT NULL,
	`duration` int NOT NULL,
	`location` varchar(255),
	`notes` text,
	`price_per_pet` decimal(10,2) NOT NULL,
	`total_price` decimal(10,2) NOT NULL,
	`status` enum('pending','accepted','rejected','completed','cancelled') NOT NULL DEFAULT 'pending',
	`rejection_reason` text,
	`cancellation_reason` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`accepted_at` timestamp,
	`completed_at` timestamp,
	`cancelled_at` timestamp,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_owner_id_owners_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `owners`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_walker_id_walkers_id_fk` FOREIGN KEY (`walker_id`) REFERENCES `walkers`(`id`) ON DELETE no action ON UPDATE no action;