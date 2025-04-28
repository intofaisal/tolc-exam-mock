<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="container">
        <?php
        while (have_posts()) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class('single-post'); ?>>
                <header class="entry-header">
                    <?php the_title('<h1 class="entry-title">', '</h1>'); ?>
                    
                    <div class="post-meta">
                        <span class="post-date"><i class="far fa-calendar-alt"></i> <?php echo get_the_date(); ?></span>
                        <span class="post-author"><i class="far fa-user"></i> <?php the_author(); ?></span>
                        <?php if (has_category()) : ?>
                            <span class="post-categories"><i class="far fa-folder-open"></i> <?php the_category(', '); ?></span>
                        <?php endif; ?>
                    </div>
                </header><!-- .entry-header -->

                <?php if (has_post_thumbnail()) : ?>
                    <div class="post-thumbnail">
                        <?php the_post_thumbnail('full'); ?>
                    </div>
                <?php endif; ?>

                <div class="entry-content">
                    <?php
                    the_content(
                        sprintf(
                            wp_kses(
                                /* translators: %s: Name of current post. Only visible to screen readers */
                                __('Continue reading<span class="screen-reader-text"> "%s"</span>', 'tolc-theme'),
                                array(
                                    'span' => array(
                                        'class' => array(),
                                    ),
                                )
                            ),
                            wp_kses_post(get_the_title())
                        )
                    );

                    wp_link_pages(
                        array(
                            'before' => '<div class="page-links">' . esc_html__('Pages:', 'tolc-theme'),
                            'after'  => '</div>',
                        )
                    );
                    ?>
                </div><!-- .entry-content -->

                <footer class="entry-footer">
                    <?php if (has_tag()) : ?>
                        <div class="post-tags">
                            <i class="fas fa-tags"></i> <?php the_tags('', ', '); ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="post-navigation">
                        <div class="post-nav-links">
                            <?php
                            $prev_post = get_previous_post();
                            if (!empty($prev_post)) :
                            ?>
                                <div class="post-nav-prev">
                                    <span class="nav-subtitle"><i class="fas fa-arrow-left"></i> Previous</span>
                                    <a href="<?php echo esc_url(get_permalink($prev_post->ID)); ?>" class="nav-title"><?php echo esc_html(get_the_title($prev_post->ID)); ?></a>
                                </div>
                            <?php endif; ?>

                            <?php
                            $next_post = get_next_post();
                            if (!empty($next_post)) :
                            ?>
                                <div class="post-nav-next">
                                    <span class="nav-subtitle">Next <i class="fas fa-arrow-right"></i></span>
                                    <a href="<?php echo esc_url(get_permalink($next_post->ID)); ?>" class="nav-title"><?php echo esc_html(get_the_title($next_post->ID)); ?></a>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </footer><!-- .entry-footer -->
            </article><!-- #post-<?php the_ID(); ?> -->

            <?php
            // If comments are open or we have at least one comment, load up the comment template.
            if (comments_open() || get_comments_number()) :
                comments_template();
            endif;

        endwhile; // End of the loop.
        ?>
    </div>
</main><!-- #main -->

<?php
get_sidebar();
get_footer();
