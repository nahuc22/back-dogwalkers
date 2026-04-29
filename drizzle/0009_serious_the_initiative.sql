ALTER TABLE `users` MODIFY COLUMN `password` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `firebaseUid` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_firebaseUid_unique` UNIQUE(`firebaseUid`);