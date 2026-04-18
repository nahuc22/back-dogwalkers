CREATE TABLE `admins` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`name` varchar(255) NOT NULL,
	`lastname` varchar(255),
	`permissions` json DEFAULT ('[]'),
	`lastLogin` timestamp,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `owners` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`name` varchar(255) NOT NULL,
	`lastname` varchar(255),
	`location` varchar(255),
	`profileImage` varchar(500),
	`description` text,
	`phone` varchar(50),
	CONSTRAINT `owners_id` PRIMARY KEY(`id`),
	CONSTRAINT `owners_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `walkers` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`name` varchar(255) NOT NULL,
	`lastname` varchar(255),
	`location` varchar(255),
	`profileImage` varchar(500),
	`description` text,
	`rating` decimal(3,2) DEFAULT '0.00',
	`experience` varchar(100),
	`verified` boolean DEFAULT false,
	`phone` varchar(50),
	CONSTRAINT `walkers_id` PRIMARY KEY(`id`),
	CONSTRAINT `walkers_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `pets` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`ownerId` bigint unsigned NOT NULL,
	`name` varchar(255) NOT NULL,
	`age` int,
	`type` enum('perro','gato','otro') NOT NULL DEFAULT 'perro',
	`size` enum('pequeño','mediano','grande'),
	`isCastrated` boolean,
	`getsAlongWithOthers` boolean,
	`medicalCondition` text,
	`specifications` text,
	`profileImage` varchar(500),
	CONSTRAINT `pets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `name` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `role` enum('owner','walker','admin') DEFAULT 'owner' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `users` ADD `createdAt` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` ADD `updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `admins` ADD CONSTRAINT `admins_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `owners` ADD CONSTRAINT `owners_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `walkers` ADD CONSTRAINT `walkers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pets` ADD CONSTRAINT `pets_ownerId_owners_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `owners`(`id`) ON DELETE cascade ON UPDATE no action;