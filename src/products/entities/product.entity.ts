import { User } from '../../auth/entities/user.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
    name: 'products'
})
export class Product {

    @ApiProperty({
        example: '5e8f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
        description: 'Product ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-shirt Teslo',
        description: 'Product title',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price'
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris euismod, nisi euismod consectetur aliquam, nisl nisl consectetur nisl, euismod euismod nisi nisl euismod nisl. Mauris euismod, nisi euismod consectetur aliquam, nisl nisl consectetur nisl, euismod euismod nisi nisl euismod nisl. Mauris euismod, nisi euismod consectetur aliquam, nisl nisl consectetur nisl, euismod euismod nisi nisl euismod nisl. Mauris euismod, nisi euismod consectetur aliquam, nisl nisl consectetur nisl, euismod euismod nisi nisl euismod nisl. Mauris euismod, nisi euismod consectetur aliquam, nisl nisl consectetur nisl, euismod euismod nisi nisl euismod nisl. Mauris euismod, nisi euismod consectetur aliquam, nisl nisl consectetur nisl, euismod euismod nisi nisl euismod nisl. Mauris euismod, nisi euismod consectetur aliquam, nisl nisl consectetur nisl, euismod euismod nisi nisl euismod nisl. Mauris euismod, nisi euismod consectetur aliquam, nisl nisl consectetur nisl, euismod euismod nisi nisl euismod nisl. Mauris euismod, nisi euismod consectetur aliquam, nisl nisl consectetur nisl, euismod euismod nisi nisl euismod nisl. Mauris euismod, nisi euismod consectetur aliquam, n',
        description: 'Product description',
        default: null,
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't-shirt-teslo',
        description: 'Product SLUG',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'L', 'XL'],
        description: 'Product sized',
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: 't-shirt-teslo',
        description: 'Product tags',
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }

    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {

        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')

    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }


}
