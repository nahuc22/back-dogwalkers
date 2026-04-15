ALTER TABLE `users` MODIFY COLUMN `lastname` varchar(255);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `age` int;--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255) NOT NULL;