ALTER TABLE `owners` ADD `address` varchar(255);--> statement-breakpoint
ALTER TABLE `owners` ADD `province` varchar(100);--> statement-breakpoint
ALTER TABLE `owners` ADD `city` varchar(255);--> statement-breakpoint
ALTER TABLE `owners` ADD `latitude` decimal(10,8);--> statement-breakpoint
ALTER TABLE `owners` ADD `longitude` decimal(11,8);--> statement-breakpoint
ALTER TABLE `walkers` ADD `address` varchar(255);--> statement-breakpoint
ALTER TABLE `walkers` ADD `province` varchar(100);--> statement-breakpoint
ALTER TABLE `walkers` ADD `city` varchar(255);--> statement-breakpoint
ALTER TABLE `walkers` ADD `latitude` decimal(10,8);--> statement-breakpoint
ALTER TABLE `walkers` ADD `longitude` decimal(11,8);