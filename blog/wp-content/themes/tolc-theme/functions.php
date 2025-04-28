<?php
/**
 * TOLC Mock Test Theme functions and definitions
 */

if (!function_exists('tolc_theme_setup')) :
    /**
     * Sets up theme defaults and registers support for various WordPress features.
     */
    function tolc_theme_setup() {
        // Add default posts and comments RSS feed links to head.
        add_theme_support('automatic-feed-links');

        // Let WordPress manage the document title.
        add_theme_support('title-tag');

        // Enable support for Post Thumbnails on posts and pages.
        add_theme_support('post-thumbnails');

        // This theme uses wp_nav_menu() in one location.
        register_nav_menus(array(
            'primary' => esc_html__('Primary Menu', 'tolc-theme'),
            'footer' => esc_html__('Footer Menu', 'tolc-theme'),
        ));

        // Switch default core markup to output valid HTML5.
        add_theme_support('html5', array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
        ));

        // Set up the WordPress core custom background feature.
        add_theme_support('custom-background', apply_filters('tolc_theme_custom_background_args', array(
            'default-color' => 'ffffff',
            'default-image' => '',
        )));

        // Add theme support for selective refresh for widgets.
        add_theme_support('customize-selective-refresh-widgets');

        // Add support for core custom logo.
        add_theme_support('custom-logo', array(
            'height'      => 250,
            'width'       => 250,
            'flex-width'  => true,
            'flex-height' => true,
        ));
    }
endif;
add_action('after_setup_theme', 'tolc_theme_setup');

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 */
function tolc_theme_content_width() {
    $GLOBALS['content_width'] = apply_filters('tolc_theme_content_width', 1140);
}
add_action('after_setup_theme', 'tolc_theme_content_width', 0);

/**
 * Register widget area.
 */
function tolc_theme_widgets_init() {
    register_sidebar(array(
        'name'          => esc_html__('Sidebar', 'tolc-theme'),
        'id'            => 'sidebar-1',
        'description'   => esc_html__('Add widgets here.', 'tolc-theme'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));

    register_sidebar(array(
        'name'          => esc_html__('Footer 1', 'tolc-theme'),
        'id'            => 'footer-1',
        'description'   => esc_html__('Add footer widgets here.', 'tolc-theme'),
        'before_widget' => '<section id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3>',
        'after_title'   => '</h3>',
    ));

    register_sidebar(array(
        'name'          => esc_html__('Footer 2', 'tolc-theme'),
        'id'            => 'footer-2',
        'description'   => esc_html__('Add footer widgets here.', 'tolc-theme'),
        'before_widget' => '<section id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3>',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'tolc_theme_widgets_init');

/**
 * Enqueue scripts and styles.
 */
function tolc_theme_scripts() {
    // Enqueue Google Fonts
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', array(), null);
    
    // Enqueue Font Awesome
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', array(), '6.0.0');
    
    // Enqueue main stylesheet
    wp_enqueue_style('tolc-theme-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Enqueue custom JavaScript
    wp_enqueue_script('tolc-theme-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '1.0.0', true);
    
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'tolc_theme_scripts');

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Create directory structure if it doesn't exist
 */
if (!file_exists(get_template_directory() . '/inc')) {
    mkdir(get_template_directory() . '/inc', 0755, true);
}

if (!file_exists(get_template_directory() . '/js')) {
    mkdir(get_template_directory() . '/js', 0755, true);
}

/**
 * Custom excerpt length
 */
function tolc_theme_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'tolc_theme_excerpt_length');

/**
 * Custom excerpt more
 */
function tolc_theme_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'tolc_theme_excerpt_more');

/**
 * Add custom classes to the body
 */
function tolc_theme_body_classes($classes) {
    // Add a class of hfeed to non-singular pages.
    if (!is_singular()) {
        $classes[] = 'hfeed';
    }

    // Add a class if sidebar is active
    if (is_active_sidebar('sidebar-1')) {
        $classes[] = 'has-sidebar';
    } else {
        $classes[] = 'no-sidebar';
    }

    return $classes;
}
add_filter('body_class', 'tolc_theme_body_classes');

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function tolc_theme_pingback_header() {
    if (is_singular() && pings_open()) {
        printf('<link rel="pingback" href="%s">', esc_url(get_bloginfo('pingback_url')));
    }
}
add_action('wp_head', 'tolc_theme_pingback_header');

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

// Create empty files if they don't exist
$required_files = array(
    '/inc/template-tags.php',
    '/inc/template-functions.php',
    '/inc/customizer.php',
    '/inc/custom-header.php',
    '/js/navigation.js'
);

foreach ($required_files as $file) {
    $file_path = get_template_directory() . $file;
    if (!file_exists($file_path)) {
        file_put_contents($file_path, '<?php // Placeholder file');
    }
}

// Create navigation.js file with content
$navigation_js = "
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-navigation');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.main-navigation') && !event.target.closest('.mobile-menu-btn')) {
            if (mainNav) {
                mainNav.classList.remove('active');
            }
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
            }
        }
    });
});
";

file_put_contents(get_template_directory() . '/js/navigation.js', $navigation_js);
