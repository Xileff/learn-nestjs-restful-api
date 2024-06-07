import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';

@Module({
  // Meski CommonModule bersifat @Global, tetap perlu import khusus di AppModule supaya diinisialisasi, barulah bisa diakses oleh modul lain
  imports: [CommonModule, UserModule, ContactModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
