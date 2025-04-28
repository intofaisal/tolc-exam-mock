<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="container">
        <?php if (is_home() && !is_front_page()) : ?>
            <header class="page-header">
                <h1 class="page-title"><?php single_post_title(); ?></h1>
                <div class="page-description">
                    <p>Stay updated with the latest news, tips, and resources for TOLC exams.</p>
                </div>
            </header>
        <?php endif; ?>

        <div class="blog-layout <?php echo is_active_sidebar('sidebar-1') ? 'has-sidebar' : 'no-sidebar'; ?>">
            <?php if (is_active_sidebar('sidebar-1')) : ?>
                <aside id="secondary" class="widget-area">
                    <?php dynamic_sidebar('sidebar-1'); ?>
                </aside>
            <?php endif; ?>

            <div class="posts-container">
                <?php
                if (have_posts()) :
                    /* Start the Loop */
                    while (have_posts()) :
                        the_post();
                        ?>
                        <article id="post-<?php the_ID(); ?>" <?php post_class('post'); ?>>
                            <?php if (has_post_thumbnail()) : ?>
                                <div class="post-thumbnail">
                                    <a href="<?php the_permalink(); ?>">
                                        <?php the_post_thumbnail('large'); ?>
                                    </a>
                                </div>
                            <?php endif; ?>

                            <div class="post-content">
                                <div class="post-meta">
                                    <span class="post-date"><i class="far fa-calendar-alt"></i> <?php echo get_the_date(); ?></span>
                                    <span class="post-author"><i class="far fa-user"></i> <?php the_author(); ?></span>
                                    <?php if (has_category()) : ?>
                                        <span class="post-categories"><i class="far fa-folder-open"></i> <?php the_category(', '); ?></span>
                                    <?php endif; ?>
                                </div>

                                <h2 class="post-title">
                                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                </h2>

                                <div class="post-excerpt">
                                    <?php the_excerpt(); ?>
                                </div>

                                <div class="post-footer">
                                    <a href="<?php the_permalink(); ?>" class="read-more-btn">Read More <i class="fas fa-arrow-right"></i></a>
                                    
                                    <?php if (has_tag()) : ?>
                                        <div class="post-tags">
                                            <?php the_tags('<i class="fas fa-tags"></i> ', ', '); ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </article>
                        <?php
                    endwhile;

                    the_posts_pagination(array(
                        'prev_text' => '<i class="fas fa-arrow-left"></i> Previous',
                        'next_text' => 'Next <i class="fas fa-arrow-right"></i>',
                        'mid_size'  => 2,
                    ));

                else :
                    ?>
                    <div class="no-results">
                        <h2>No Posts Found</h2>
                        <p>Sorry, but no posts match your criteria. Try using the search form below.</p>
                        <?php get_search_form(); ?>
                    </div>
                    <?php
                endif;
                ?>
            </div>
        </div>
    </div>
</main><!-- #main -->

<?php
get_footer();
